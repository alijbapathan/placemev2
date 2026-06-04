import { useEffect, useState } from 'react'
import { tpoApi } from '../../services/tpoApi'

const TpoTestAttempts = () => {
	const [attempts, setAttempts] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetchAttempts()
	}, [])

	const fetchAttempts = async () => {
		try {
			const res = await tpoApi.getAttempts()
			setAttempts(res.data.results || res.data || [])
		} catch (err) {
			console.log(err)
			alert('Failed to load attempts')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Test Attempts</h1>
				<p className="text-slate-500">Student test attempts</p>
			</div>

			<div className="bg-white rounded-2xl border overflow-hidden">
				<table className="w-full">
					<thead className="bg-slate-100">
						<tr>
							<th className="p-4 text-left">Student</th>
							<th className="p-4 text-left">Test</th>
							<th className="p-4 text-left">Score</th>
						</tr>
					</thead>

					<tbody>
						{loading ? (
							<tr>
								<td className="p-6 text-center" colSpan="3">
									Loading...
								</td>
							</tr>
						) : (
							attempts.map((a) => (
								<tr key={a.id} className="border-t">
									<td className="p-4">{a.student_name || a.student?.name}</td>
									<td className="p-4">{a.test?.title || a.test_title}</td>
									<td className="p-4">{a.score || a.percentage || '—'}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default TpoTestAttempts
