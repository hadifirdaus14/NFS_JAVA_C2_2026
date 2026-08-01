import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { fetchPagedTickets } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const TicketDataContext = createContext(null);

const initialState = {
  tickets: [],
  selectedTicketId: '',
  loading: false,
  error: '',
  // Server-side paging + sorting state
  pageInfo: {
    page: 0,
    size: 5,
    sortBy: 'createdAt',
    direction: 'desc',
    totalPages: 0,
    totalElements: 0
  },
  // In-memory cache of previously fetched pages, keyed by page|size|sortBy|direction
  cache: {},
  cacheMessage: 'No page loaded yet.',
  // Client-side filters applied to the current page
  filters: {
    searchText: '',
    statusFilter: 'ALL',
    priorityFilter: 'ALL'
  }
};

// One page response is uniquely identified by these four values.
function makeCacheKey(params) {
  return `${params.page}|${params.size}|${params.sortBy}|${params.direction}`;
}

function ticketReducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: '', cacheMessage: 'Fetching from backend…' };

    case 'LOAD_SUCCESS': {
      // action.data is the Spring Page object; action.params is what we requested
      const tickets = action.data.content ?? [];

      const selectedStillVisible = tickets.some((ticket) => ticket.id === state.selectedTicketId);
      const selectedTicketId = selectedStillVisible ? state.selectedTicketId : tickets[0]?.id ?? '';

      // On a cache HIT we keep the cache as-is; on a MISS we store the fresh page.
      const nextCache = action.fromCache
        ? state.cache
        : { ...state.cache, [action.cacheKey]: action.data };

      return {
        ...state,
        tickets,
        selectedTicketId,
        loading: false,
        error: '',
        pageInfo: {
          page: action.data.number ?? action.params.page,
          size: action.data.size ?? action.params.size,
          sortBy: action.params.sortBy,
          direction: action.params.direction,
          totalPages: action.data.totalPages ?? 0,
          totalElements: action.data.totalElements ?? 0
        },
        cache: nextCache,
        cacheMessage: action.fromCache ? 'Loaded from cache' : 'Fetched from backend'
      };
    }

    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.message, cacheMessage: 'Could not load data.' };

    case 'SET_SEARCH_TEXT':
      return { ...state, filters: { ...state.filters, searchText: action.value } };

    case 'SET_STATUS_FILTER':
      return { ...state, filters: { ...state.filters, statusFilter: action.value } };

    case 'SET_PRIORITY_FILTER':
      return { ...state, filters: { ...state.filters, priorityFilter: action.value } };

    case 'SELECT_TICKET':
      return { ...state, selectedTicketId: action.ticketId };

    default:
      return state;
  }
}

export function TicketDataProvider({ children }) {
  const { token } = useAuth();
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  // Refs let loadTicketsPage read the latest pageInfo and cache WITHOUT depending
  // on them — keeping the function stable so the mount effect doesn't loop.
  const pageInfoRef = useRef(state.pageInfo);
  const cacheRef = useRef(state.cache);
  useEffect(() => {
    pageInfoRef.current = state.pageInfo;
  }, [state.pageInfo]);
  useEffect(() => {
    cacheRef.current = state.cache;
  }, [state.cache]);

  const loadTicketsPage = useCallback(async (overrides = {}) => {
    const current = pageInfoRef.current;
    const params = {
      page: overrides.page ?? current.page,
      size: overrides.size ?? current.size,
      sortBy: overrides.sortBy ?? current.sortBy,
      direction: overrides.direction ?? current.direction
    };

    const cacheKey = makeCacheKey(params);
    const cachedPage = cacheRef.current[cacheKey];

    // CACHE HIT: reuse the stored page unless the caller forced a refresh.
    if (cachedPage && !overrides.force) {
      dispatch({ type: 'LOAD_SUCCESS', data: cachedPage, params, cacheKey, fromCache: true });
      return;
    }

    // CACHE MISS (or forced refresh): go to the backend.
    dispatch({ type: 'LOAD_START' });

    try {
      const data = await fetchPagedTickets(token, params);
      dispatch({ type: 'LOAD_SUCCESS', data, params, cacheKey, fromCache: false });
    } catch (error) {
      dispatch({ type: 'LOAD_ERROR', message: error.message || 'Could not load tickets.' });
    }
  }, [token]);

  // Refresh = reload the CURRENT page but skip the cache.
  const refreshTickets = useCallback(() => loadTicketsPage({ force: true }), [loadTicketsPage]);

  // Paging + sort controls
  const goToNextPage = useCallback(() => {
    const { page, totalPages } = pageInfoRef.current;
    if (page + 1 < totalPages) {
      loadTicketsPage({ page: page + 1 });
    }
  }, [loadTicketsPage]);

  const goToPreviousPage = useCallback(() => {
    const { page } = pageInfoRef.current;
    if (page > 0) {
      loadTicketsPage({ page: page - 1 });
    }
  }, [loadTicketsPage]);

  const setPageSize = useCallback((size) => loadTicketsPage({ size: Number(size), page: 0 }), [loadTicketsPage]);
  const setSortBy = useCallback((sortBy) => loadTicketsPage({ sortBy, page: 0 }), [loadTicketsPage]);
  const setSortDirection = useCallback((direction) => loadTicketsPage({ direction, page: 0 }), [loadTicketsPage]);

  // Client-side filters: just update state, no re-fetch
  const setSearchText = useCallback((value) => dispatch({ type: 'SET_SEARCH_TEXT', value }), []);
  const setStatusFilter = useCallback((value) => dispatch({ type: 'SET_STATUS_FILTER', value }), []);
  const setPriorityFilter = useCallback((value) => dispatch({ type: 'SET_PRIORITY_FILTER', value }), []);
  const selectTicket = useCallback((ticketId) => dispatch({ type: 'SELECT_TICKET', ticketId }), []);

  const visibleTickets = useMemo(() => {
    const search = state.filters.searchText.trim().toLowerCase();

    return state.tickets.filter((ticket) => {
      const matchesSearch =
        !search ||
        ticket.title.toLowerCase().includes(search) ||
        ticket.category.toLowerCase().includes(search) ||
        ticket.createdBy.toLowerCase().includes(search);

      const matchesStatus =
        state.filters.statusFilter === 'ALL' || ticket.status === state.filters.statusFilter;

      const matchesPriority =
        state.filters.priorityFilter === 'ALL' || ticket.priority === state.filters.priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [state.tickets, state.filters]);

  const selectedTicket = useMemo(() => {
    return visibleTickets.find((ticket) => ticket.id === state.selectedTicketId)
      ?? visibleTickets[0]
      ?? null;
  }, [visibleTickets, state.selectedTicketId]);

  const value = useMemo(
    () => ({
      ...state,
      visibleTickets,
      selectedTicket,
      loadTicketsPage,
      refreshTickets,
      goToNextPage,
      goToPreviousPage,
      setPageSize,
      setSortBy,
      setSortDirection,
      setSearchText,
      setStatusFilter,
      setPriorityFilter,
      selectTicket
    }),
    [state, visibleTickets, selectedTicket, loadTicketsPage, refreshTickets, goToNextPage, goToPreviousPage, setPageSize, setSortBy, setSortDirection, setSearchText, setStatusFilter, setPriorityFilter, selectTicket]
  );

  return <TicketDataContext.Provider value={value}>{children}</TicketDataContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTicketData() {
  const value = useContext(TicketDataContext);

  if (!value) {
    throw new Error('useTicketData must be used inside a TicketDataProvider');
  }

  return value;
}
