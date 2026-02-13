function SignUpRightImage() {
  return (
    <div className="relative hidden md:block w-[52%] h-auto bg-darkGreen overflow-hidden">
      <img src="/leaf-pattern.avif" alt="Leaf Pattern" className="w-full h-full object-cover object-center " />
      <div className="absolute bottom-2 right-4 text-White font-bold text-6xl">
        <p>
          Moss <span>X</span>
        </p>
      </div>
    </div>
  )
}

export default SignUpRightImage
