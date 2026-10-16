import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import GroupDetail from '../components/detail/GroupDetail'
import DetailSkeleton from '../components/detail/DetailSkeleton'
import NotFoundPage from './NotFoundPage'

function CollectionPage() {
  const { id } = useParams()
  const { data: collection, loading, error } = useFetch(`/collections/${id}`)

  if (loading) return <DetailSkeleton />
  if (error || !collection)
    return <NotFoundPage title="Collection not found" message="This collection may no longer be available." />
  return <GroupDetail item={collection} type="collection" />
}

export default CollectionPage
