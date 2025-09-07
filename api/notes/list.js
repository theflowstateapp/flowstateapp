// Vercel Serverless Function - Notes List
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Mock notes data for demo purposes
  const notes = [
    {
      id: 'note-1',
      title: 'Meeting Notes - Product Planning',
      content: 'Discussed new features for Q4 launch. Key points:\n- User feedback integration\n- Performance improvements\n- Mobile optimization',
      category: 'work',
      tags: ['meeting', 'product', 'planning'],
      isPinned: true,
      createdAt: '2025-09-06T10:00:00Z',
      updatedAt: '2025-09-06T10:30:00Z'
    },
    {
      id: 'note-2',
      title: 'Recipe Ideas',
      content: 'Weekend cooking ideas:\n- Pasta carbonara\n- Grilled salmon\n- Chocolate cake',
      category: 'personal',
      tags: ['cooking', 'recipes', 'weekend'],
      isPinned: false,
      createdAt: '2025-09-05T15:00:00Z',
      updatedAt: '2025-09-05T15:00:00Z'
    },
    {
      id: 'note-3',
      title: 'Book Recommendations',
      content: 'Books to read:\n- "Atomic Habits" by James Clear\n- "The Lean Startup" by Eric Ries\n- "Deep Work" by Cal Newport',
      category: 'learning',
      tags: ['books', 'reading', 'self-improvement'],
      isPinned: false,
      createdAt: '2025-09-04T20:00:00Z',
      updatedAt: '2025-09-04T20:00:00Z'
    }
  ];

  res.status(200).json({
    success: true,
    notes,
    total: notes.length,
    stats: {
      pinned: notes.filter(n => n.isPinned).length,
      categories: [...new Set(notes.map(n => n.category))],
      totalTags: [...new Set(notes.flatMap(n => n.tags))].length
    }
  });
}
