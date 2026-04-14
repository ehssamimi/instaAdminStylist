import { loginFormSchema } from "@/lib/validation-schemas"

type FormState = {
    errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
    }
    message?: string
} | undefined

export async function signup(state: FormState, formData: FormData) {
    // Validate form fields
    const validatedFields = loginFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    })

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    // 2. Prepare data for insertion into database
    const { email, password } = validatedFields.data
    // e.g. Hash the user's password before storing it

    // 3. Insert the user into the database or call an Auth Library's API
    // TODO: Implement database connection
    /*
    const data = await db
        .insert(users)
        .values({
            email,
            password,
        })
        .returning({ id: users.id })

    const user = data[0]

    if (!user) {
        return {
            message: 'An error occurred while creating your account.',
        }
    }
    */

    // For now, simulate successful signup
    console.log('Signup attempt:', { email, password })
    return {
        message: 'Account created successfully (simulated)',
    }

    // TODO:
    // 4. Create user session
    // 5. Redirect user
}