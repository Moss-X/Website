import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import GroupDetail from '../components/detail/GroupDetail'
import DetailSkeleton from '../components/detail/DetailSkeleton'
import NotFoundPage from './NotFoundPage'

function BundlePage() {
  const { id } = useParams()
  const { data: bundle, loading, error } = useFetch(`/bundles/${id}`)

  if (loading) return <DetailSkeleton />
  if (error || !bundle)
    return <NotFoundPage title="Bundle not found" message="This bundle may no longer be available." />
  return <GroupDetail item={bundle} type="bundle" />
}

export default BundlePage
