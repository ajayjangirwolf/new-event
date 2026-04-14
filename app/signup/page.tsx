import Link from "next/link";
import { SignupForm } from "@/components/forms/signup-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Join as a user or organizer.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
          <p className="mt-4 text-xs text-slate-600">
            Already have an account? <Link className="underline" href="/login">Login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
