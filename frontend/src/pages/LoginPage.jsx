import LoginHeader from '../components/login/LoginHeader'
import LoginForm from '../components/login/LoginForm'

const LoginPage = () => {
  return (
    <div className="flex flex-col pt-28 justify-center py-12 sm:px-6 lg:px-8">
      <div className="flex flex-row relative mt-8 w-[90%] mx-auto shadow-2xl sm:w-full sm:max-w-md  md:max-w-3xl">
        <div className="p-4 md:p-2 w-full md:w-[48%]">
          <div className="py-8 flex flex-col gap-8 sm:rounded-lg sm:px-6">
            <LoginHeader />
            <LoginForm />
          </div>
        </div>
        <div className="relative hidden md:block w-[52%] h-auto bg-darkGreen overflow-hidden">
          <img src="/leaf-pattern.avif" alt="Leaf Pattern" className="w-full h-full object-cover object-center " />
          <div className="absolute bottom-2 right-4 text-White font-bold text-6xl">
            <p>
              Moss <span>X</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
