/* Done by: Alex , written on 20 June 2026*/

function Account() {
  return (
    <section className="planned-page account-page">
      <div className="avatar-wrap">
        <div className="avatar">
          <span>Profile</span>
          <span>Picture</span>
        </div>
        <button className="edit-avatar" type="button" aria-label="Edit profile picture">
          Edit
        </button>
      </div>
      <p className="user-name">User 1</p>
      <div className="profile-card">
        <h2>Profile</h2>
        <p>Name: John Doe</p>
        <p>Email Address: johndoe@gmail.com</p>
        <p>Date of Birth: 1 Jan 2000</p>
        <p>Address: 123 Doe street</p>
      </div>
    </section>
  );
}

export default Account;
