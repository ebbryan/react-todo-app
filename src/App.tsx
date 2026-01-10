import { useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
import { todoSchema, type Todo, type TodoInput } from "./schemas/todo.schema";
import Spinner from "./components/Spinner";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const createForm = useForm<TodoInput>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit: SubmitHandler<TodoInput> = async (data) => {
    // Convert input → output (apply defaults)
    const todo: Todo = todoSchema.parse(data);

    setTodos((prev) => [...prev, todo]);

    createForm.reset(); // optional: clear input
  };

  return (
    <section className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full h-full md:w-3/4 lg:w-1/2 xl:w-1/3">
        <h1 className="text-2xl font-bold text-neutral-800">
          React + Vite Todo App
        </h1>

        <div
          className={`flex flex-col items-center justify-between w-md h-full`}
        >
          <div
            className={`flex flex-col items-center ${
              todos.length === 0 ? "justify-center" : "justify-between"
            } w-md h-full`}
          >
            {todos.length === 0 && <p>No todos yet!</p>}

            {todos.map((todo) => (
              <div key={todo.id} className="border-b border-gray-200 py-2">
                <p>{todo.title}</p>
                <p className="text-sm text-gray-500">
                  {dayjs(todo.dateCreated).format("MM/DD/YYYY")}
                </p>
              </div>
            ))}
          </div>

          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(onSubmit)}
              className="w-full flex items-center justify-between gap-2"
            >
              <fieldset
                className="flex flex-col gap-3 w-full"
                disabled={isUpdating}
              >
                <div className="w-full flex flex-col gap-2">
                  <FormField
                    control={createForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter your todo title"
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </fieldset>
              <Button
                variant="default"
                type="submit"
                disabled={createForm.formState.isSubmitting}
              >
                {createForm.formState.isSubmitting ? (
                  <>
                    <Spinner />
                    <span className="sr-only">Loading...</span>
                    Loading
                  </>
                ) : (
                  "Add Todo"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}

export default App;
