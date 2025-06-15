const Homepage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Trekking Website</h1>
      <p className="mb-4">Explore Nepal’s iconic trekking routes.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Placeholder for featured packages */}
        <div className="p-4 border rounded">Annapurna Base Camp</div>
        <div className="p-4 border rounded">Everest Base Camp</div>
        <div className="p-4 border rounded">Manaslu Circuit</div>
      </div>
    </div>
  );
};
export default Homepage;
