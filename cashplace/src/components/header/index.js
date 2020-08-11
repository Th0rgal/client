import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

const Header = () => (
	<header class={style.header}>
		<h1>cash.place escrow</h1>
		<nav>
			<Link activeClassName={style.active} href="/">Home</Link>
			<a href="https://cash.place">cash.place</a>
		</nav>
	</header>
);

export default Header;
