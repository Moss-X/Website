import { useEffect, useState } from 'react';
import { ShoppingCart, Zap } from 'lucide-react';
import { useCollectionStore } from '../stores/useCollectionStore';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import CollectionCard from './CollectionCard';

function CollectionsPreview() {
  const [visibleCount, setVisibleCount] = useState(6);
  const [showAll, setShowAll] = useState(false);
  const { collections, fetchCollections, loading, error } =
    useCollectionStore();
  const { addCollectionToCart } = useCartStore();
  const navigate = useNavigate();
  // fetch collections
  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);
  // responsive visible count
  useEffect(() => {
    function updateCount() {
      setVisibleCount(window.innerWidth < 768 ? 4 : 6);
    }
    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, []);

  if (error) return <div className="text-red-400">{error}</div>;
  if (!collections.length) return null;

  function handleAddToCart(e, collection) {
    e.stopPropagation();
    addCollectionToCart(collection);
  }
  function handleBuyNow(e, collection) {
    e.stopPropagation();
    addCollectionToCart(collection);
    navigate('/cart');
  }

  return (
    <section className="flex flex-col gap-8 my-16 ">
      {collections.map((collection, index) => (
        <>
          <CollectionCard collection={collection} odd={index % 2 === 0} />
          <CollectionCard collection={collection} odd={index % 2 === 1} />
        </>
      ))}
    </section>
  );
}

export default CollectionsPreview;
