export const NotFound = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-primary to-gray-900 flex items-center justify-center p-4'>
      <div className='text-center'>
        <h1 className='text-9xl font-bold text-secondary mb-4'>404</h1>
        <h2 className='text-4xl font-bold text-white mb-4'>Page Not Found</h2>
        <p className='text-gray-300 text-lg mb-8'>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href='/'
          className='inline-block bg-secondary text-primary font-bold py-3 px-8 rounded-lg hover:bg-accent transition'>
          Return to Home
        </a>
      </div>
    </div>
  );
};
