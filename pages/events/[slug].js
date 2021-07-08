import { parseCookies } from '@/helpers/index'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'
import Image from 'next/image'
import { FaPencilAlt, FaTimes, FaArrowLeft } from 'react-icons/fa'
import Layout from '@/components/Layout'
import { API_URL } from '@/config/index'
import styles from '@/styles/Event.module.css'
import { useRouter } from 'next/router'

export default function EventPage({ evt, userOwned }) {
	const router = useRouter()

	const deleteEvent = async () => {
		if (confirm('Are you sure?')) {
			const res = await fetch(`${API_URL}/events/${evt.id}`, {
				method: 'DELETE'
			})

			const data = await res.json()

			if (!res.ok) {
				toast.error(data.message)
			} else {
				toast.success('Event deleted successsfully!')
				router.push('/events')
			}
		}
	}

	return (
		<Layout title='My Event | DJ Events'>
			<div className={styles.event}>
				<Link href='/events'>
					<a className={`${styles.back} ${styles.icon}`}>
						<FaArrowLeft /> <span>Go Back</span>
					</a>
				</Link>

				{userOwned && (
					<>
						<div className={styles.controls}>
							<Link href={`/events/edit/${evt.id}`}>
								<a className={styles.icon}>
									<FaPencilAlt /> <span>Edit</span>
								</a>
							</Link>
							<a
								href='#!'
								className={`${styles.delete} ${styles.icon}`}
								onClick={deleteEvent}
							>
								<FaTimes /> <span>Delete</span>
							</a>
						</div>
					</>
				)}
			</div>
			<span>
				{new Date(evt.date).toLocaleDateString('en-GB')} at {evt.time}
			</span>
			<h1>{evt.name}</h1>

			<ToastContainer position='top-center' draggable />

			{evt.image && (
				<div className={styles.image}>
					<Image src={evt.image.formats.medium.url} width={960} height={600} />
				</div>
			)}
			<h3>Performers:</h3>
			<p>{evt.performers}</p>
			<h3>Description:</h3>
			<p>{evt.description}</p>
			<h3>Venue: {evt.venue}</h3>
			<p>{evt.address}</p>
		</Layout>
	)
}

export async function getServerSideProps({ query: { slug }, req }) {
	const { token } = parseCookies(req)
	let user = null
	let userOwned = false

	if (token) {
		const lu = await fetch(`${API_URL}/events/me`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
		user = await lu.json()
	}

	const res = await fetch(`${API_URL}/events?slug=${slug}`)
	const events = await res.json()

	if (user) {
		if (user.filter(u => u.id === events[0].id).length === 1) {
			userOwned = true
		}
	}

	return {
		props: {
			evt: events[0],
			userOwned
		}
	}
}
