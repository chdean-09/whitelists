'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import submitCSV from '@/lib/submitCsv';

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button disabled={disabled || pending} type="submit">
      {pending ?
        <>
          Submitting
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </>
        :
        <>
          Submit
        </>
      }
    </Button>
  )
}

export default function CSVFileForm() {
  const [file, setFile] = useState<File | null>(null);
  const [state, formAction] = useActionState(submitCSV, {
    message: null,
    ok: false
  })

  return (
    <>
      {state?.message &&
        <p className={`${!state.ok ? 'text-red-500' : 'text-white'}`}>
          {state?.message}
        </p>
      }
      <form className='w-full flex flex-row gap-2' action={formAction} onSubmit={() => setFile(null)}>
        <Input
          type="file"
          name='csvFile'
          accept=".csv"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            setFile(files ? files[0] : null);
          }}
        />
        <SubmitButton disabled={!file} />
      </form>
    </>
  )
}