import { createClient } from '@/utils/supabase/server'
import { createNote, updateNote, deleteNote } from '@/app/actions'
import { redirect } from 'next/navigation'

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

describe('Note Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Unauthenticated User', () => {
    it('should redirect to sign-in when creating a note', async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
          }),
        },
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);

      const formData = new FormData();
      formData.append('title', 'Test Note');
      formData.append('content', 'Test Content');

      await createNote(formData);

      expect(redirect).toHaveBeenCalledWith('/sign-in');
    });

    it('should redirect to sign-in when updating a note', async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
          }),
        },
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);

      const formData = new FormData();
      formData.append('id', '1');
      formData.append('title', 'Updated Note');
      formData.append('content', 'Updated Content');

      await updateNote(formData);

      expect(redirect).toHaveBeenCalledWith('/sign-in');
    });

    it('should redirect to sign-in when deleting a note', async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
          }),
        },
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);

      const formData = new FormData();
      formData.append('id', '1');

      await deleteNote(formData);

      expect(redirect).toHaveBeenCalledWith('/sign-in');
    });
  });

  describe('createNote', () => {
    it('should create a new note successfully', async () => {
      const mockNote = {
        id: '1',
        title: 'Test Note',
        content: 'Test Content',
        user_id: 'test-user',
        created_at: new Date().toISOString(),
      }

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'test-user' } },
          }),
        },
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockNote,
          error: null,
        }),
      }

      ;(createClient as jest.Mock).mockResolvedValue(mockSupabase)

      const formData = new FormData()
      formData.append('title', 'Test Note')
      formData.append('content', 'Test Content')

      await createNote(formData)

      expect(mockSupabase.from).toHaveBeenCalledWith('notes')
      expect(mockSupabase.insert).toHaveBeenCalledWith({
        title: 'Test Note',
        content: 'Test Content',
        user_id: 'test-user',
      })
      expect(redirect).toHaveBeenCalledWith('/protected/notes')
    })

    it('should handle errors when creating a note', async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'test-user' } },
          }),
        },
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('Database error'),
        }),
      }

      ;(createClient as jest.Mock).mockResolvedValue(mockSupabase)

      const formData = new FormData()
      formData.append('title', 'Test Note')
      formData.append('content', 'Test Content')

      await expect(createNote(formData)).rejects.toThrow('Database error')
    })
  })

  describe('updateNote', () => {
    it('should update a note successfully', async () => {
      const mockNote = {
        id: '1',
        title: 'Updated Note',
        content: 'Updated Content',
        user_id: 'test-user',
        updated_at: new Date().toISOString(),
      }

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'test-user' } },
          }),
        },
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockNote,
          error: null,
        }),
      }

      ;(createClient as jest.Mock).mockResolvedValue(mockSupabase)

      const formData = new FormData()
      formData.append('id', '1')
      formData.append('title', 'Updated Note')
      formData.append('content', 'Updated Content')

      await updateNote(formData)

      expect(mockSupabase.from).toHaveBeenCalledWith('notes')
      expect(mockSupabase.update).toHaveBeenCalledWith({
        title: 'Updated Note',
        content: 'Updated Content',
        updated_at: expect.any(String),
      })
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1')
      expect(redirect).toHaveBeenCalledWith('/protected/notes')
    })

    it('should handle errors when updating a note', async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'test-user' } },
          }),
        },
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('Database error'),
        }),
      }

      ;(createClient as jest.Mock).mockResolvedValue(mockSupabase)

      const formData = new FormData()
      formData.append('id', '1')
      formData.append('title', 'Updated Note')
      formData.append('content', 'Updated Content')

      await expect(updateNote(formData)).rejects.toThrow('Database error')
    })
  })

  describe('deleteNote', () => {
    it('should delete a note successfully', async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'test-user' } },
          }),
        },
        from: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          error: null,
        }),
      }

      ;(createClient as jest.Mock).mockResolvedValue(mockSupabase)

      const formData = new FormData()
      formData.append('id', '1')

      await deleteNote(formData)

      expect(mockSupabase.from).toHaveBeenCalledWith('notes')
      expect(mockSupabase.delete).toHaveBeenCalled()
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1')
      expect(redirect).toHaveBeenCalledWith('/protected/notes')
    })

    it('should handle errors when deleting a note', async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'test-user' } },
          }),
        },
        from: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: {
              message: 'Database error',
              details: 'Error details',
              hint: 'Error hint',
              code: 'ERROR'
            }
          })
        }),
      }

      ;(createClient as jest.Mock).mockResolvedValue(mockSupabase)

      const formData = new FormData()
      formData.append('id', '1')

      await expect(deleteNote(formData)).rejects.toThrow('Database error')
    })
  })
}) 