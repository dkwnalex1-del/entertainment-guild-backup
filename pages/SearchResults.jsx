const results = ['Result 1', 'Result 2', 'Result 3', 'Result 4'];

function SearchResults({ openPage }) {
  return (
    <section className="planned-page search-page">
      <h2>Search Results</h2>
      <div className="result-grid">
        {results.map((result) => (
          <button className="result-card" key={result} onClick={() => openPage('product')} type="button">
            {result}
          </button>
        ))}
      </div>
    </section>
  );
}

export default SearchResults;
