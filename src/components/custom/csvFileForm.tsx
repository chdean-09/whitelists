'use client';

import { useActionState, useEffect, useState } from 'react';
import { Input } from '../ui/input';
import submitCSV from '@/lib/submitCsv';
import SubmitButton from './submitButton';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

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
      {state.message && !state.duplicates &&
        <p className={`${!state.ok ? 'text-red-500' : 'text-green-400'} text-sm`}>
          {state.message}
        </p>
      }
      {state.message && state.duplicates &&
        <>
          <p className='text-yellow-400 text-sm'>
            {state.message}
          </p>
          <HoverCard>
            <HoverCardTrigger className='text-yellow-400 text-sm underline cursor-pointer'>
              Hover here to view duplicates
            </HoverCardTrigger>
            <HoverCardContent className='overflow-auto max-h-64'>
              <ul className='list-disc list-inside'>
                {state.duplicates.map((duplicate, index) => (
                  <li key={index}>
                    {duplicate.email}        
                  </li>
                ))}
              </ul>
            </HoverCardContent>
          </HoverCard>
        </>
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