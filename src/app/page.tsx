"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Copy, Github, Lock, Unlock,Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [caesarShift, setCaesarShift] = useState([3])
  const [vigenereKey, setVigenereKey] = useState("KEY")
  const [playfairKey, setPlayfairKey] = useState("MONARCHY")
  const [railCount, setRailCount] = useState([3])
  const [isLoading, setIsLoading] = useState(false)

  const handleEncrypt = async (cipher: string) => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a message to encrypt",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      const params = new URLSearchParams()
      params.append("text", input)
      params.append("cipher", cipher)

      if (cipher === "caesar") {
        params.append("shift", caesarShift[0].toString())
      } else if (cipher === "vigenere") {
        params.append("key", vigenereKey)
      } else if (cipher === "playfair") {
        params.append("key", playfairKey)
      } else if (cipher === "railfence") {
        params.append("rails", railCount[0].toString())
      }

      console.log(`Sending request to: https://ciphers-backend.vercel.app/cipher?${params.toString()}`)
      
      const response = await fetch(`https://ciphers-backend.vercel.app/cipher?${params.toString()}`)
      
      console.log("Response status:", response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to encrypt message")
      }

      const data = await response.json()
      console.log("Encryption response:", data)
      
      setOutput(data.result)

      toast({
        title: "Message encrypted!",
        description: "Your message has been successfully encrypted.",
        action: <ToastAction altText="Copy to clipboard" onClick={copyToClipboard}>Copy</ToastAction>,
      })
    } catch (error) {
      console.error("Encryption error:", error)
      toast({
        title: "Encryption failed",
        description: error instanceof Error ? error.message : "There was an error encrypting your message.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    toast({
      title: "Copied to clipboard",
      description: "The encrypted message has been copied to your clipboard.",
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 text-slate-800 dark:text-slate-100 p-4 md:p-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500 text-white p-2 rounded-lg">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-0">
              Cipherly
            </h1>
          </div>
          <ThemeToggle />
        </div>

        <p className="text-slate-600 dark:text-slate-400 max-w-xl mb-8">
          Secure your messages with classical encryption algorithms
        </p>

        <div className="grid gap-8">
          <Card className="border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-indigo-500" />
                Input Message
              </CardTitle>
              <CardDescription>Enter the message you want to encrypt</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Type your message here..."
                className="min-h-[120px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </CardContent>
          </Card>

          <Tabs defaultValue="rot13" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 bg-slate-100 dark:bg-slate-800 p-1">
              <TabsTrigger
                value="rot13"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 transition-all duration-200 hover:cursor-pointer"
              >
                ROT-13
              </TabsTrigger>
              <TabsTrigger
                value="caesar"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 transition-all duration-200 hover:cursor-pointer"
              >
                Caesar
              </TabsTrigger>
              <TabsTrigger
                value="playfair"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 transition-all duration-200 hover:cursor-pointer"
              >
                Playfair
              </TabsTrigger>
              <TabsTrigger
                value="vigenere"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 transition-all duration-200 hover:cursor-pointer"
              >
                Vigenère
              </TabsTrigger>
              <TabsTrigger
                value="railfence"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 transition-all duration-200 hover:cursor-pointer"
              >
                Rail Fence
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rot13">
              <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader>
                  <CardTitle>ROT-13 Cipher</CardTitle>
                  <CardDescription>Shifts each letter 13 places in the alphabet</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors duration-200 hover:cursor-pointer"
                    onClick={() => handleEncrypt("rot13")}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Encrypting...
                      </>
                    ) : (
                      "Encrypt with Rot-13"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="caesar">
              <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader>
                  <CardTitle>Caesar Cipher</CardTitle>
                  <CardDescription>Shifts each letter by a specified number of places</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Shift Value: {caesarShift[0]}</Label>
                      </div>
                      <Slider
                        value={caesarShift}
                        min={1}
                        max={25}
                        step={1}
                        onValueChange={setCaesarShift}
                        className="w-full bg-white dark:bg-slate-100"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors duration-200 hover:cursor-pointer"
                    onClick={() => handleEncrypt("caesar")}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Encrypting...
                      </>
                    ) : (
                      "Encrypt with Caesar"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="playfair">
              <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader>
                  <CardTitle>Playfair Cipher</CardTitle>
                  <CardDescription>Uses a 5x5 grid of letters for encryption</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Keyword</Label>
                      <Input
                        value={playfairKey}
                        onChange={(e) => setPlayfairKey(e.target.value.toUpperCase())}
                        className="focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        placeholder="Enter keyword (e.g. MONARCHY)"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors duration-200 hover:cursor-pointer"
                    onClick={() => handleEncrypt("playfair")}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Encrypting...
                      </>
                    ) : (
                      "Encrypt with Playfair"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="vigenere">
              <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader>
                  <CardTitle>Vigenère Cipher</CardTitle>
                  <CardDescription>Uses a keyword to determine the shift for each letter</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Keyword</Label>
                      <Input
                        value={vigenereKey}
                        onChange={(e) => setVigenereKey(e.target.value.toUpperCase())}
                        className="focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        placeholder="Enter keyword (e.g. KEY)"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors duration-200 hover:cursor-pointer"
                    onClick={() => handleEncrypt("vigenere")}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Encrypting...
                      </>
                    ) : (
                      "Encrypt with Vigenère"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="railfence">
              <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader>
                  <CardTitle>Rail Fence Cipher</CardTitle>
                  <CardDescription>Arranges text in a zigzag pattern on rails</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Number of Rails: {railCount[0]}</Label>
                      </div>
                      <Slider
                        value={railCount}
                        min={2}
                        max={10}
                        step={1}
                        onValueChange={setRailCount}
                        className="w-full bg-white dark:bg-slate-100"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors duration-200 hover:cursor-pointer"
                    onClick={() => handleEncrypt("railfence")}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Encrypting...
                      </>
                    ) : (
                      "Encrypt with Rail Fence"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Unlock className="h-5 w-5 text-indigo-500" />
                Encrypted Output
              </CardTitle>
              <CardDescription>Your encrypted message will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-4 min-h-[120px] font-mono break-all">
                {output || (
                  <span className="text-slate-400 dark:text-slate-500">Encrypted message will appear here...</span>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 hover:cursor-pointer"
                onClick={copyToClipboard}
                disabled={!output}
              >
                <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
              </Button>
            </CardFooter>
          </Card>
        </div>

        <footer className="mt-12 text-center text-slate-500 dark:text-slate-400 text-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <a
              href="https://github.com/Mujster/Cipherly"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </div>
          <p>Cipherly © {new Date().getFullYear()} | Secure your communications with classical cryptography</p>
        </footer>
      </div>
    </main>
  )
}

