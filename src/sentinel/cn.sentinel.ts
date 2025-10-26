/**
 * Sentinelle de build pour { cn }.
 * Échoue la compilation si cn disparaît ou change de type.
 */
import { cn } from "@/lib/utils";

const test: string = cn("a", "b");
void test;

export {};
