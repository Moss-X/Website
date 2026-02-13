import SignUpHeader from '../components/sign/SignUpHeader'
import SignUpForm from '../components/sign/SignUpForm'
import SignUpRightImage from '../components/sign/SignUpRightImage'
const SignUpPage = () => {
  return (
    <div className="flex flex-col pt-28 justify-center py-12 sm:px-6 lg:px-8">
      <div className="flex flex-row relative mt-8 w-[90%] mx-auto shadow-2xl sm:w-full sm:max-w-md md:max-w-3xl">
        <div className="p-4 md:p-2 w-full md:w-[48%]">
          <div className="py-8 flex flex-col gap-8 sm:rounded-lg sm:px-6">
            <SignUpHeader />
            <SignUpForm />
          </div>
        </div>
        <SignUpRightImage />
      </div>
    </div>
  )
}

export default SignUpPage
