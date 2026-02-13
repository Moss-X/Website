import { Link } from 'react-router-dom'

const LoginHeader = () => {
  return (
    <>
      <div>
        <p className="ml-2 absolute font-bold text-2xl text-black">
          Moss <span className="text-textGreen">X</span>
        </p>
      </div>
      <div className="flex flex-col gap-8">
        <div>
          <p className="pt-8 text-black text-3xl font-bold">Sign-In</p>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 my-2">
          <p className="text-red-700 text-sm font-medium">
            Warning: Do not add personal details as they might be stored in our database.
            <br />
            Contact us to remove yourself.
          </p>
        </div>

        <div>
          <p className="text-black opacity-70 text-sm font-medium">
            Don&apos;t have an account?
            <span>
              {' '}
              <Link to="/signup" className="font-medium text-textGreen hover:opacity-70">
                Create Now
              </Link>
            </span>
          </p>
        </div>
      </div>
    </>
  )
}

export default LoginHeader
