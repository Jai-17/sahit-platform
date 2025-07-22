import { createClient } from "@supabase/supabase-js";
import jwt from 'jsonwebtoken';
import {config} from 'dotenv';
config();

const chatClient = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!, {
    auth: {
        persistSession: false,
    }
})

export default chatClient;