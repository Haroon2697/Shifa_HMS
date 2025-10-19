import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <div className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-cyan-400 mb-2">Account Created!</h1>
            <p className="text-slate-400">Please check your email to confirm your account.</p>
          </div>

          <div className="bg-slate-700 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-slate-300">
              We've sent a confirmation email to your inbox. Click the link in the email to activate your account and
              start using HMS.
            </p>
          </div>

          <Link href="/auth/login">
            <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg">
              Back to Login
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
