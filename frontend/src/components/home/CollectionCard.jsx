import { useNavigate } from 'react-router-dom'

function CollectionCard({ collection, odd }) {
  const navigate = useNavigate()
  if (!odd) {
    return (
      <div className="relative flex flex-col md:flex-row w-full aspect-square xs:aspect-video md:aspect-2/1 overflow-hidden">
        <div className="flex -z-10 md:hidden items-center justify-center absolute ">
          <img src={collection.image} alt="" />
        </div>
        {/* Left Image Content */}
        <div className="relative hidden md:block overflow-hidden w-full md:w-[50%] h-full">
          <img
            src={collection.image}
            alt="Image Could Not Load"
            className="absolute hidden md:block left-0 lg:w-[55%] lg:max-w-100 object-contain"
          />
          <img
            src={collection.image}
            alt="Image Could Not Load"
            className="hidden lg:block absolute right-[20%] bottom-0 w-[50%] md:w-[40%] md:max-w-75 object-contain"
          />
        </div>
        {/* Right Text Content */}
        <div className=" flex p-[6%] md:p-0 text-secondary flex-col justify-center items-start gap-4 w-full lg:w-[50%]  md:px-4">
          <h1 className="text-3xl lg:text-5xl md:text-black font-bold">
            {collection.title} heading will be this big to look good
          </h1>
          <p className="text-base md:text-lg text-gray md:text-gray-600 font-semibold line-clamp-3 md:line-clamp-none">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus voluptatibus harum nobis tenetur? Eaque
            accusantium mollitia beatae tempore, iusto Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ullam
            officia temporibus a ad, perferendis nostrum nobis assumenda
          </p>

          <button
            className="absolute bottom-[6%] md:bottom-0 md:relative px-6 py-3 bg-primary text-white rounded-full shadow-md hover:bg-darkGreen transition"
            onClick={() => navigate(`/collections/${collection._id}`)}
          >
            Shop {collection.title}
          </button>
        </div>
      </div>
    )
  }
  if (odd) {
    return (
      <div className="relative flex flex-col md:flex-row w-full aspect-square  xs:aspect-video md:aspect-2/1 overflow-hidden">
        <div className="flex -z-10 md:hidden items-center justify-center absolute ">
          <img src={collection.image} alt="" />
        </div>
        {/* Left Text Content */}
        <div className=" flex p-[6%] md:p-0 text-secondary flex-col justify-center items-start gap-4 w-full lg:w-[50%]  md:px-4">
          <h1 className="text-3xl lg:text-5xl md:text-black font-bold">
            {collection.title} heading will be this big to look good
          </h1>
          <p className="text-base md:text-lg text-gray md:text-gray-600 font-semibold line-clamp-3 md:line-clamp-none">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus voluptatibus harum nobis tenetur? Eaque
            accusantium mollitia beatae tempore, iusto Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ullam
            officia temporibus a ad, perferendis nostrum nobis assumenda
          </p>

          <button
            className="absolute bottom-[6%] md:bottom-0 md:relative px-6 py-3 bg-primary text-white rounded-full shadow-md hover:bg-darkGreen transition"
            onClick={() => navigate(`/collections/${collection._id}`)}
          >
            Shop {collection.title}
          </button>
        </div>

        {/* Right Image Content */}
        <div className="relative hidden md:block overflow-hidden w-full md:w-[50%] h-full">
          <img
            src={collection.image}
            alt="Image Could Not Load"
            className="absolute hidden md:block right-0 lg:w-[55%] lg:max-w-100 object-contain"
          />
          <img
            src={collection.image}
            alt="Image Could Not Load"
            className="hidden lg:block absolute left-[20%] bottom-0 w-[50%] md:w-[40%] md:max-w-75 object-contain"
          />
        </div>
      </div>
    )
  }
}

export default CollectionCard
