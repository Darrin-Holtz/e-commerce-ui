import Image from "next/image"

const Homepage = () => {
  return (
    <div className=''>
      <div className="relative aspect-[3/1] mb-12">
        <Image src="/featured.png" alt="Featured product" fill />
      </div>
    </div>
  )
}

export default Homepage