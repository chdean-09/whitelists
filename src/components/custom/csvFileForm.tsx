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
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [state, formAction] = useActionState(submitCSV, {
    message: null,
    ok: false
  })

  useEffect(() => {
    setFile(null);
  }, [state]);

  function validFileSize(fileSize: number): boolean {
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

    return fileSize <= MAX_FILE_SIZE
  }

  return (
    <>
      {fileSize !== null && !validFileSize(fileSize) &&
        <p className='text-red-500 text-sm'>
          File size exceeds 1 MB. Please upload a smaller file.
        </p>
      }
      {state.message && !state.duplicates && !state.invalids &&
        !(fileSize !== null && !validFileSize(fileSize)) &&
        <p className={`${!state.ok ? 'text-red-500' : 'text-green-400'} text-sm`}>
          {state.message}
        </p>
      }
      {state.message && (state.duplicates || state.invalids) &&
        !(fileSize !== null && !validFileSize(fileSize)) &&
        <>
          <p className={`${!state.ok ? 'text-red-500' : 'text-yellow-300'} text-sm`}>
            {state.message}
          </p>
          {state.ok &&
            <HoverCard>
              <HoverCardTrigger className='text-yellow-300 text-sm underline cursor-pointer'>
                Hover here to view duplicates/invalids
              </HoverCardTrigger>
              <HoverCardContent className='overflow-auto max-h-64'>
                {state.duplicates &&
                  <ul className='list-disc list-inside'>
                    <p className='font-bold'>Duplicates:</p>          
                    {state.duplicates.map((duplicate, index) => (
                      <li key={index} className='text-sm'>
                        {duplicate.email}
                      </li>
                    ))}
                  </ul>
                }
                {state.invalids &&
                  <ul className='list-disc list-inside'>
                    <p className='font-bold'>Invalid Emails:</p>
                    {state.invalids.map((invalid, index) => (
                      <li key={index} className='text-sm'>
                        {invalid.email}
                      </li>
                    ))}
                  </ul>
                }
              </HoverCardContent>
            </HoverCard>
          }
        </>
      }
      <form className='w-full flex flex-row gap-2' action={formAction}>
        <Input
          type="file"
          name='csvFile'
          accept=".csv"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            setFileSize(files ? files[0].size : null);
            setFile(files ? files[0] : null);
          }}
        />
        <SubmitButton disabled={
          !file ||
          (fileSize !== null && !validFileSize(fileSize))
        } />
      </form>
    </>
  )
}