import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { getHabits, createHabit, updateHabit, toggleHabitToday } from "../api/habits";
import type { Habit } from "../types/types";


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
      staleTime: 1000 * 60 * 5, 
       cacheTime: 1000 * 60 * 60 * 24,
    },
  },
});


export function useHabits() {

  const habitsQuery = useQuery<Habit[]>({
    queryKey: ["habits"],
    queryFn: getHabits,
  });

  const createHabitMutation = useMutation({
    mutationFn: createHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  const updateHabitMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Habit> }) =>
      updateHabit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  const toggleHabitMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      toggleHabitToday(id, completed),
    onSuccess: (updatedHabits) => {
      queryClient.setQueryData(["habits"], updatedHabits);
    },
  });

  return {
    habitsQuery,

    createHabitAsync: createHabitMutation.mutateAsync,

    updateHabitAsync: updateHabitMutation.mutateAsync,

    toggleHabitAsync: toggleHabitMutation.mutateAsync,
  };
}
