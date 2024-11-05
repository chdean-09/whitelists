'use client';

import { useActionState, useState } from 'react';
import { Input } from '../ui/input';
import SubmitButton from './submitButton';
import submitEmail from '@/lib/submitEmail';

export default function EmailForm() {
  const [email, setEmail] = useState<string>('');
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [state, formAction] = useActionState(submitEmail, {
    message: null,
    ok: false
  })

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailPattern.test(value));
  };

  return (
    <>
      {state?.message &&
        <p className={`${!state.ok ? 'text-red-500' : 'text-green-400'} text-sm`}>
          {state?.message}
        </p>
      }
      <form className='w-full flex flex-row gap-2' action={formAction} onSubmit={() => {
        setEmail('')
        setIsEmailValid(false)
      }}>
        <Input
          type="email"
          name="email"
          placeholder="Enter Email Manually"
          value={email}
          onChange={handleEmailChange}
        />
        <SubmitButton disabled={!isEmailValid} />
      </form>
    </>
  )
}