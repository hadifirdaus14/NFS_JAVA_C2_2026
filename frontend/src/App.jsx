import { useEffect, useMemo, useState } from 'react'
import Layout from './components/Layout'
import SummaryCards from './components/SummaryCards'
import { sampleAssets } from './data/sampleAssets.js'
import { filterAssets } from './utils/assets'
import './styles.css'

export default function App() {
  const [assets] = useState(sampleAssets)
  const [selectedAsset, setSelectedAsset] = useState(sampleAssets[0])

  const filteredAssets = useMemo(
    () => filteredAssets(assets, searchText, statusFilter),
    [assets, searchText, statusFilter]
  );

  
  return (
    <Layout>
      <SummaryCards assets={filteredAssets} />

      <FilterPanel
        searchText={searchText}
        statusFilter={statusFilter}
        onSearchText={setSearchText}
        onStatusChange={setStatusFilter}
      />

      <section className="workspace-grid">
      <AssetList
        assets={filteredAssets}
        selectedAssetId={selectedAsset?.id}
        onSelectAsset={setSelectedAsset}
      />
      <AssetDetails asset={selectedAsset} />
      </section>
    </Layout>
  )
}
