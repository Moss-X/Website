import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { login, loading } = useUserStore();

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(email, password);
		login(email, password);
	};

	const handleForgotPassword = () => {
		}

	return (
		<div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>

			<div
				className='flex flex-row relative mt-8 w-[90%] mx-auto shadow-2xl sm:w-full sm:max-w-md  md:max-w-3xl'
			>	
				<div className="p-4 md:p-2 w-full md:w-[48%]">

				<div>
					<p className="ml-2 absolute font-bold text-2xl text-black">Moss <span className="text-textGreen">X</span></p>
				</div>
				<div className='py-8 flex flex-col gap-8 sm:rounded-lg sm:px-6'>
				<div>
					<p className="pt-8 text-black text-3xl font-bold">Sign-In</p>
				</div>
				<div>
					<p className="text-black opacity-70 text-sm font-medium">Don't have and account? 
						<span> <Link to='/signup' className='font-medium text-textGreen hover:opacity-70'>
							Create Now 
						</Link></span>
					</p>
				</div>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div>
							<label htmlFor='email' className='block text-sm font-medium text-black opacity-70 mb-2'>
								E-mail
							</label>
							<div className='mt-1 relative rounded-md shadow-xs'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Mail className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='email'
									type='email'
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className=' block w-full px-3 py-2 pl-10 border border-darkGray  
									rounded-md shadow-xs text-black
									placeholder-gray-400 focus:outline-hidden focus:ring-black 
									 focus:border-black sm:text-sm'
									 placeholder='you@example.com'
									 />
							</div>
						</div>

						<div>
							<label htmlFor='password' className='block text-sm font-medium text-black opacity-70 mb-2'>
								Password
							</label>
							<div className='mt-1 relative rounded-md shadow-xs'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='password'
									type='password'
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className=' block w-full px-3 py-2 pl-10 border border-darkGray  
									rounded-md shadow-xs text-black
									 placeholder-gray-400 focus:outline-hidden focus:ring-black 
									 focus:border-black sm:text-sm'
									 placeholder='••••••••'
									 />
							</div>
						</div>
						<div className='flex items-center justify-end'>
							<div className='text-sm'>
								<Link
									to='#'
									className='font-medium text-textGreen hover:opacity-70'
									onClick={handleForgotPassword}
								>
									Forgot your password?
								</Link>
							</div>
						</div>
						<button
							type='submit'
							className='w-full flex justify-center py-2 px-4 border border-transparent 
							rounded-md shadow-xs text-sm font-medium text-white bg-textGreen
							 hover:bg-darkGreen focus:outline-hidden focus:ring-2 focus:ring-offset-2
							 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'
							 disabled={loading}
						>
							{loading ? (
								<>
									<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
									Loading...
								</>
							) : (
								<>
									<LogIn className='mr-2 h-5 w-5' aria-hidden='true' />
									Login
								</>
							)}
						</button>
					</form>

					
				</div>
							</div>
			<div className="hidden md:block w-[52%] h-[100%] bg-darkGreen">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro sapiente similique ad aliquid deleniti exercitationem quidem? Ut corporis fugiat, quod sint eveniet debitis iure, reprehenderit numquam, deleniti repellat temporibus voluptatibus!Lorem Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam tenetur illo et ipsam vel explicabo voluptates voluptas quis, iusto, delectus similique? Sapiente reiciendis incidunt voluptate quisquam ducimus quaerat nostrum expedita minus, totam eveniet porro facilis harum commodi exercitationem veniam excepturi! Voluptas deserunt, excepturi maiores pariatur facilis repellat. Numquam quasi expedita iste? Ratione, officiis magnam nulla placeat enim dolorem. Necessitatibus, cum? Provident libero beatae reiciendis molestias maiores dolorum accusantium, iste porro labore odit omnis similique? Aut sapiente quia vel cum perferendis fuga accusamus quasi animi hic, culpa ea nam rem. Libero aliquid voluptates voluptatem tempore, neque accusamus vitae delectus quod possimus omnis nisi at? Laboriosam illo nobis voluptate mollitia rerum nemo aliquam commodi omnis voluptates totam! Sit, aspernatur.	
			</div>
			</div>
		</div>
	);
};
export default LoginPage;
