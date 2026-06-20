function Account() {
  return (
    <section className="page-section">
      <h2>Manage Account</h2>
      <p>User account details, order history, and settings will be managed here.</p>
      <form className="account-form">
        <label>
          Display name
          <input type="text" placeholder="Customer name" />
        </label>
        <label>
          Email
          <input type="email" placeholder="customer@example.com" />
        </label>
      </form>
    </section>
  );
}

export default Account;
