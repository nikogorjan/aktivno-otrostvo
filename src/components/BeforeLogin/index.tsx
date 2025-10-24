import React from 'react'

export const BeforeLogin: React.FC = () => {
  return (
    <div>
      <p>
        <b>Pozdravljeni!</b>
        <a href={`${process.env.PAYLOAD_PUBLIC_SERVER_URL}/login`}>Prijava</a>
      </p>
    </div>
  )
}
