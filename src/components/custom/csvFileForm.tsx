'use client';

import { useActionState, useEffect, useState } from 'react';
import { Input } from '../ui/input';
import submitCSV from '@/lib/submitCsv';
import SubmitButton from './submitButton';

export default function CSVFileForm() {
  const [file, setFile] = useState<File | null>(null);
  const [state, formAction] = useActionState(submitCSV, {
    message: null,
    ok: false
  })

  useEffect(() => {
    setFile(null);
  }, [state]);

  return (
    <>
      {state.message &&
        <p className={`${!state.ok ? 'text-red-500' : 'text-green-400'} text-sm`}>
          {state.message}
        </p>
      }
      <form className='w-full flex flex-row gap-2' action={formAction}>
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