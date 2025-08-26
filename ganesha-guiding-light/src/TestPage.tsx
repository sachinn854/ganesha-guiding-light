import React from 'react';

const TestPage = () => {
  return (
    <div style={{ padding: '50px', backgroundColor: 'lightblue', minHeight: '100vh' }}>
      <h1 style={{ color: 'red', fontSize: '48px' }}>TEST PAGE WORKING!</h1>
      <p style={{ color: 'black', fontSize: '24px' }}>If you see this, React is fine!</p>
      <button style={{ padding: '20px', fontSize: '20px', backgroundColor: 'green', color: 'white' }}>
        Test Button
      </button>
    </div>
  );
};

export default TestPage;
