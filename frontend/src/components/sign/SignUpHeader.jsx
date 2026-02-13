import { Link } from 'react-router-dom'

const SignUpHeader = () => {
  return (
    <>
      <div>
        <p className="ml-2 absolute font-bold text-2xl text-black">
          Moss <span className="text-textGreen">X</span>
        </p>
      </div>
      <div className="flex flex-col gap-8">
        <div>
          <p className="pt-8 text-black text-3xl font-bold">Sign-Up</p>
        </div>
        <div>
          <p className="text-black opacity-70 text-sm font-medium">
            Already have an account?
            <span>
              {' '}
              <Link to="/login" className="font-medium text-textGreen hover:opacity-70">
                Login here
              </Link>
            </span>
          </p>
        </div>
      </div>
    </>
  )
}

export default SignUpHeader
