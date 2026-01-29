import FarmerDashboardLayout from '../../components/general/FarmerDashboardLayout'

const FarmerSupport = () => {
  const [formData, setFormData] = React.useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    description: ''
  });

  const [tickets, setTickets] = React.useState([
    {
      id: 1,
      subject: 'How do I update product pricing?',
      category: 'Product Management',
      status: 'Open',
      priority: 'Medium',
      createdAt: '2024-01-15',
      createdBy: 'Current User'
    },
    {
      id: 2,
      subject: 'Payment not received',
      category: 'Billing',
      status: 'In Progress',
      priority: 'High',
      createdAt: '2024-01-14',
      createdBy: 'Current User'
    }
  ]);

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting ticket:', formData);
    alert('Support ticket submitted successfully!');
    setFormData({
      subject: '',
      category: 'general',
      priority: 'medium',
      description: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-blue-500';
      case 'in progress': return 'bg-amber-500';
      case 'resolved': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <FarmerDashboardLayout>
      <h1 className='text-2xl font-bold'>Support Center</h1>
      <p className='text-gray-600'>Get help and submit support tickets</p>

      {/* Quick Help Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-6'>
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#90C955] transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
              <i className='bi bi-book text-2xl text-[#78C726]'></i>
            </div>
            <h3 className='font-bold text-lg'>Documentation</h3>
          </div>
          <p className='text-gray-600 text-sm mb-3'>Browse our comprehensive guides and tutorials</p>
          <button className='text-[#78C726] hover:underline text-sm font-semibold'>
            View Docs <i className='bi bi-arrow-right'></i>
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className='bi bi-question-circle text-2xl text-blue-600'></i>
            </div>
            <h3 className='font-bold text-lg'>FAQs</h3>
          </div>
          <p className='text-gray-600 text-sm mb-3'>Find answers to commonly asked questions</p>
          <button className='text-blue-600 hover:underline text-sm font-semibold'>
            View FAQs <i className='bi bi-arrow-right'></i>
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-300 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className='bi bi-chat-dots text-2xl text-purple-600'></i>
            </div>
            <h3 className='font-bold text-lg'>Live Chat</h3>
          </div>
          <p className='text-gray-600 text-sm mb-3'>Chat with our support team in real-time</p>
          <button className='text-purple-600 hover:underline text-sm font-semibold'>
            Start Chat <i className='bi bi-arrow-right'></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Support Tickets */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
              <i className='bi bi-ticket-perforated text-xl text-[#78C726]'></i>
            </div>
            <h2 className='text-xl font-bold'>My Support Tickets</h2>
          </div>

          <div className="overflow-x-auto">
            <table className='w-full'>
              <thead className='bg-[#E6F2D9]'>
                <tr>
                  <th className='text-left p-3 font-semibold text-gray-800 text-sm'>ID</th>
                  <th className='text-left p-3 font-semibold text-gray-800 text-sm'>Subject</th>
                  <th className='text-center p-3 font-semibold text-gray-800 text-sm'>Priority</th>
                  <th className='text-center p-3 font-semibold text-gray-800 text-sm'>Status</th>
                  <th className='text-center p-3 font-semibold text-gray-800 text-sm'>Date</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, index) => (
                  <tr key={ticket.id} className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className='p-3 text-sm font-semibold text-gray-700'>#{ticket.id}</td>
                    <td className='p-3'>
                      <div className='text-sm font-semibold text-gray-800'>{ticket.subject}</div>
                      <div className='text-xs text-gray-500'>{ticket.category}</div>
                    </td>
                    <td className='p-3 text-center'>
                      <span className={`text-sm font-semibold ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className='p-3 text-center'>
                      <span className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className='p-3 text-center text-sm text-gray-600'>{ticket.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submit New Ticket */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
              <i className='bi bi-plus-circle text-xl text-[#78C726]'></i>
            </div>
            <h2 className='text-xl font-bold'>Submit New Ticket</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="subject" className='block text-sm font-semibold text-gray-700 mb-2'>
                Subject *
              </label>
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#90C955] focus:outline-none transition-all'
                placeholder="Brief description of your issue"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className='block text-sm font-semibold text-gray-700 mb-2'>
                  Category *
                </label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#90C955] focus:outline-none transition-all'
                  required
                >
                  <option value="general">General</option>
                  <option value="product">Product Management</option>
                  <option value="orders">Orders</option>
                  <option value="billing">Billing</option>
                  <option value="technical">Technical Issue</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className='block text-sm font-semibold text-gray-700 mb-2'>
                  Priority *
                </label>
                <select 
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#90C955] focus:outline-none transition-all'
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className='block text-sm font-semibold text-gray-700 mb-2'>
                Description *
              </label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#90C955] focus:outline-none transition-all'
                placeholder="Provide detailed information about your issue..."
                required
              ></textarea>
            </div>

            <button 
              type="submit"
              className='w-full bg-[#90C955] hover:bg-[#7ab043] text-white font-semibold p-3 rounded-lg transition-all flex items-center justify-center gap-2'
            >
              <i className='bi bi-send'></i>
              Submit Ticket
            </button>
          </form>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-[#E6F2D9] rounded-2xl border-2 border-[#90C955] p-6 mt-6">
        <h2 className='text-xl font-bold mb-4 flex items-center gap-2'>
          <i className='bi bi-headset text-[#78C726]'></i>
          Need Immediate Help?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className='flex items-center gap-3'>
            <i className='bi bi-envelope-fill text-2xl text-[#78C726]'></i>
            <div>
              <p className='text-sm text-gray-600'>Email Support</p>
              <p className='font-semibold'>support@bajoma.com</p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <i className='bi bi-telephone-fill text-2xl text-[#78C726]'></i>
            <div>
              <p className='text-sm text-gray-600'>Phone Support</p>
              <p className='font-semibold'>+1 (555) 123-4567</p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <i className='bi bi-clock-fill text-2xl text-[#78C726]'></i>
            <div>
              <p className='text-sm text-gray-600'>Support Hours</p>
              <p className='font-semibold'>Mon-Fri, 9AM-5PM</p>
            </div>
          </div>
        </div>
      </div>
    </FarmerDashboardLayout>
  )
}

export default FarmerSupport