import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ items = [], active }) {
	return (
		<aside
			style={{
				background: "#0f2228",
				color: "#e6eff4",
				padding: "18px 16px",
				minHeight: "100vh",
				position: "sticky",
				top: 0,
			}}
		>
			<nav style={{ display: "grid", gap: 6 }}>
				{items.map(item => (
					<NavLink
						key={item.id}
						to={item.path}
						style={({ isActive }) => ({
							textAlign: "left",
							border: "none",
							background: isActive || item.id === active ? "#16313a" : "transparent",
							color: "#e6eff4",
							padding: "12px 12px",
							borderRadius: 10,
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: 10,
							fontWeight: 600,
							textDecoration: "none",
						})}
						onClick={item.onClick}
					>
						<span aria-hidden="true">{item.icon}</span>
						{item.label}
					</NavLink>
				))}
			</nav>
		</aside>
	);
}
