import React from 'react'

export default function dataCard() {
  return (
    
    <div>
      <div className="container text-center my-5">
</div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        {
          array.length > 0 ? (  // Render the fruits if the array has data
            array.map((fruit, index) => (
              <div key={index}>
                <p>{fruit}</p>
              </div>
            ))
          ) : (
            <p>No fruits available</p>  // Fallback message if no data is fetched
          )
        }
      </div>
    </div>
  )
}
