// navigation bar


const NavBar = ({ onAdd, onLeft, onRight }) => (
  <div
    style={{
      position: "absolute",
      bottom: 40,
      left: "50%",
      transform: "translateX(-50%)",
      background: "#232323",
      borderRadius: "12px",
      padding: "12px 20px",
      display: "flex",
      alignItems: "center",
      gap: 48,
      boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
      zIndex: 20,
    }}
  >
    <button
      onClick={onLeft}
      style={{
        background: "none",
        border: "none",
        color: "#fff",
        fontSize: 40,
        cursor: "pointer",
        outline: "none",
      }}
      aria-label="Previous"
    >
      &lt;
    </button>
    <button
      onClick={onAdd}
      style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "#fff",
        border: "none",
        color: "#232323",
        fontSize: 36,
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
        cursor: "pointer",
        outline: "none",
      }}
      aria-label="Add"
    >
      +
    </button>
    <button
      onClick={onRight}
      style={{
        background: "none",
        border: "none",
        color: "#fff",
        fontSize: 40,
        cursor: "pointer",
        outline: "none",
      }}
      aria-label="Next"
    >
      &gt;
    </button>
  </div>
);

export default NavBar;
