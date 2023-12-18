import Image from "next/image"
import AuthForm from "./components/AuthForm"

export default function Home() {
  return (
    <div 
      className="
        flex
        min-h-full
        flex-col
        justify-center
        py-12
        sm:px-6
        lg:px-8
        bg-gray-100
      "
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-row-reverse items-center">
        <Image 
          alt="Logo"
          height="100"
          width="100"
          className=""
          src="/images/logo.png"
        />
        <h2
          className="
            text-center
            text-5xl
            font-bold
            tracking-tight
            text-gray-900
          "
        >
          <span className="text-blue-600">Members</span>
          <span className="text-black">Only</span>
        </h2>
      </div>
      <AuthForm />
    </div>
  )
}
