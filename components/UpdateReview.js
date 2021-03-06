import { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { GiPartyPopper } from 'react-icons/gi'
import { MdNotInterested } from 'react-icons/md'
import { API_URL } from '@/config/index'
import styles from '@/styles/Review.module.css'

export default function UpdateReview({ name, review, updateReview, token }) {
	const [description, setDescription] = useState(review.description)
	const [attend, setAttend] = useState(review.attendance || 'maybe')

	const onSubmit = async e => {
		e.preventDefault()
		const values = {
			description,
			attendance: attend,
			name
		}
		const res = await fetch(`${API_URL}/reviews/${review.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(values)
		})

		if (res.ok) {
			updateReview()
		}
	}

	return (
		<div className={styles.inputContainer}>
			<div className={styles.update}>
				<h4>
					Update Review{' '}
					{attend === 'going' ? (
						<GiPartyPopper />
					) : attend === 'no' ? (
						<MdNotInterested />
					) : (
						<></>
					)}
				</h4>
			</div>

			<textarea
				placeholder='How did you change your mind?'
				value={description}
				onChange={e => setDescription(e.target.value)}
			></textarea>
			<div className={styles.row}>
				<div className={styles.opinion}>
					<h4>Are you going to this party?</h4>
					<label htmlFor='go'>
						On My Way!
						<input
							type='radio'
							id='go'
							value='going'
							checked={attend === 'going'}
							onChange={e => setAttend(e.target.value)}
						/>
					</label>
					<label htmlFor='may'>
						If I can make it.
						<input
							type='radio'
							id='may'
							value='maybe'
							checked={attend === 'maybe'}
							onChange={e => setAttend(e.target.value)}
						/>
					</label>
					<label htmlFor='nein'>
						It's not for me!
						<input
							type='radio'
							id='nein'
							value='no'
							checked={attend === 'no'}
							onChange={e => setAttend(e.target.value)}
						/>
					</label>
				</div>
				<button
					className='btn btn-primary'
					type='submit'
					onClick={e => onSubmit(e)}
				>
					Submit
				</button>
			</div>
		</div>
	)
}
