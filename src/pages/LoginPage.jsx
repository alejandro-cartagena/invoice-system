function LoginPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[100vh]">
      {/* Add your login form here */}
        <form action="" className="bg-[#232e39] rounded-lg border border-[#979797] max-w-[546px] pt-12 pb-6 px-14">
            <div>
                {/* Logo Image Container */}
                <div>
                    <div className="flex justify-center align-middle w-[100%] max-w-[298px] mx-auto mb-12 pb-10 border-b border-b-[#9d9db2]">
                        <a href="" className="no-underline">
                            <img src="https://cdn.iriscrm.com/volt/public/logos/www.voltmscrm.com_new_ui?v=20240618085742" alt="" srcset="" className="max-w-[179px] max-h-[109px]" />
                        </a>
                    </div>
                </div>

                {/* Center Block */}
                <div className="min-w-[320px] flex flex-col justify-center items-center">
                    <div className="w-[327px] h-[78px] pt-0 relative">
                        <input 
                            type="text"
                            placeholder="Enter Username"
                            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-[#e38932] bg-[#d99320] text-white placeholder-white"
                        />
                    </div>
                    <div className="w-[327px] h-[78px] pt-0 relative">
                        <input 
                            type="password"
                            placeholder="Enter Password"
                            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-[#e38932] bg-[#d99320] text-white placeholder-white"
                        />
                    </div>
                </div>


                {/* Input Checkbox */}
                <div className="flex justify-center items-center mb-4">
                    <input
                        type="checkbox"
                        id="remember"
                        className="w-4 h-4 text-[#e38932] bg-[#d99320] border-gray-300 rounded focus:ring-[#e38932] focus:ring-2"
                    />
                    <label htmlFor="remember" className="ml-2 text-white">
                        Remember me
                    </label>

                </div>

                {/* Login Button */}
                <div className="flex justify-center">
                    <button className="text-center min-w-[40px] min-h-[40px] h-[40px] bg-[#e38932] text-white cursor-pointer w-[172px]">Log In</button>
                </div>

                {/* Forgot Username or Password */}
                <div className="flex justify-center">
                    <a href="#" className="text-[#0090ff] no-underline">Forgot Username or Password?</a>
                </div>

            </div>

        </form>

    </div>
  )
}

export default LoginPage 