import React from "react";

export default function Header({ user, onDashboard, onLogin, onRegister }) {
	return (
		<header
			style={{
				height: 52,
				background: "#fff",
				borderBottom: "1px solid var(--border)",
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				padding: "0 16px",
				boxShadow: "var(--shadow)",
				position: "sticky",
				top: 0,
				zIndex: 10,
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
				<span
					style={{
						display: "inline-flex",
						width: 36,
						height: 36,
						borderRadius: 12,
						background: "var(--orange)",
						color: "#fff",
						alignItems: "center",
						justifyContent: "center",
						fontWeight: 700,
					}}
				>
					N
				</span>
				<div>
					<strong style={{ display: "block" }}>Nuam Exchange</strong>
					<small style={{ color: "var(--muted)" }}>Calificaciones tributarias</small>
				</div>
			</div>

			<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
				<button className="btn ghost" onClick={onDashboard}>Dashboard</button>
				<button className="btn ghost" onClick={onLogin}>Ingresar</button>
				<button className="btn primary" onClick={onRegister}>Crear cuenta</button>

				{user && (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 10,
							paddingLeft: 12,
							borderLeft: "1px solid var(--border)",
						}}
					>
						<div
							style={{
								width: 38,
								height: 38,
								borderRadius: "50%",
								background: "#f3f6f9",
								display: "grid",
								placeItems: "center",
								fontWeight: 700,
								color: "var(--dark)",
							}}
						>
							{user.initials || "NA"}
						</div>
						<div>
							<div style={{ fontWeight: 600 }}>{user.name}</div>
							<div style={{ color: "var(--muted)", fontSize: 13 }}>{user.role}</div>
						</div>
					</div>
				)}
			</div>
		</header>
	);
}
