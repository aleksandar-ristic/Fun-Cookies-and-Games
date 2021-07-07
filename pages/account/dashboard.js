import { parseCookies } from '@/helpers/index'
import Layout from '@/components/Layout'
import { API_URL } from '@/config/index'
import styles from '@/styles/Dashboard.module.css'

export default function DashboardPage({ events }) {
	return (
		<Layout title='User Dashboard | DJ Events'>
			<div className={styles.dash}>
				<h1>Dashboard</h1>
				<h3>My Events</h3>

				{events.map(evt => (
					<h3>{evt.name}</h3>
				))}
			</div>
		</Layout>
	)
}

export async function getServerSideProps({ req }) {
	const { token } = parseCookies(req)

	const res = await fetch(`${API_URL}/events/me`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	const events = await res.json()

	return {
		props: {
			events
		}
	}
}