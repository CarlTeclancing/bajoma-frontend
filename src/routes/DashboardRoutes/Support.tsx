import DashboardLayout from '../../components/general/DashboardLayout'

const Support = () => {
  return (
    <DashboardLayout>
        <h1 className='text-2xl font-bold'>Support Center</h1>
        <p>How can we help you? Find answers to common questions or reach out to our support team.</p>
        <div className="flex w-full flex-col gap-4 mt-4 bg-[#E6F2D9] p-6 rounded-2xl">
            <div className="flex flex-col">
                <span className='text-2xl font-bold'><i className='bi bi-headset'></i> Customer Support</span>
                <p>We're here to assist you with any questions or issues you may have. Our support team is available to help you with account management, technical difficulties, and more.</p>
                <table className='bg-white p-4 mt-4 rounded border'>
                    <thead>
                        <tr className='border'>
                            <th className='border p-4 text-left'>Issue</th>
                            <th className='border p-4 text-left'>By</th>
                            <th className='border p-4 text-left'>Date</th>
                            <th className='border p-4 text-left'>Status</th>
                            <th className='border p-4 text-left'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='p-4'>How do I reset my password?</td>
                            <td className='p-4'>John Doe</td>
                            <td className='p-4'>2024-01-15</td>
                            <td className='p-4'>Open</td>
                            <td className='p-4'><button className='bg-green-500 text-white p-2 rounded'>View</button></td>
                        </tr>
                    </tbody>
                </table>

                <form action="">
                    <h2 className='text-xl font-bold mt-6'>Submit a New Support Ticket</h2>
                    <div className="flex flex-col mt-4">
                        <label htmlFor="issue">Issue</label>
                        <input type="text" name="issue" className='w-full p-2 border border-gray rounded' />
                    </div>
                    <div className="flex flex-col mt-4">
                        <label htmlFor="description">Description</label>
                        <textarea name="description" rows={4} className='w-full p-2 border border-gray rounded'></textarea>
                    </div>
                    <button className='mt-4 bg-green-500 text-white p-2 rounded float-right'>Submit Ticket</button>
                </form>
            </div>
        </div>
                
    </DashboardLayout>
  )
}

export default Support