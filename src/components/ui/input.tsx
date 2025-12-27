import React from 'react'
import "./input.css"
export default function input() {
  return (

<div className="input-container">
  <input type="text" id="input" required />
  <label htmlFor="input" className="label">Enter Text</label>
  <div className="underline"></div>
</div>

  )
}
