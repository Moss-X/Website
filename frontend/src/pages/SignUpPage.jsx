import SignUpHeader from '../components/sign/SignUpHeader'
import SignUpForm from '../components/sign/SignUpForm'

const SignUpPage = () => {
  return (
    <div className="flex flex-col pt-28 justify-center py-12 sm:px-6 lg:px-8">
      <div className="flex flex-row relative mt-8 w-[90%] mx-auto shadow-2xl sm:w-full sm:max-w-md ">
        <div className="py-4 px-4 w-full">
          <div className=" py-8 px-6 flex flex-col gap-8 sm:rounded-lg sm:px-10">
            <SignUpHeader />
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
