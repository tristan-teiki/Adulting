<script>
  import CountryList from 'country-list-with-dial-code-and-flag'
	import { text } from 'svelte/internal';
  import { supabase } from '../data/supabase'

  $: phone = ""
  $: token = ""
  $: countryCode = ""
  $: errors = []
  $: messages = []
  $: tokenSent = false
  $: authenticated = false

  const handleLogin = async (phone, code) => {
    const { error } = await supabase.auth.signInWithOtp({
      phone: code + phone
    })

    if (error) {
      errors = [...errors, "Something went wrong, try again"]
    } else {
      messages = [...messages, "Message sent"]
      errors = []
      tokenSent = true
    }
  }

  const verifyToken = async (phone, code, token) => {
    let { data, error } = await supabase.auth.verifyOtp({
      phone: code + phone,
      token,
      type: 'sms'
    })

    messages = []

    if (data && data.user !== null) {
      authenticated = true
      console.log(data)
    }

    if (error) {
      errors = [...errors, "Verify the recieved code again"]
    }
  }

  const validateInput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9.]/g, '')
  }

  const handlePhoneInput = () => {
    errors = []

    if (countryCode === "") {
      errors = [...errors, "Country dial code is necessary"]
      return
    }

    if (phone === "") {
      errors = [...errors, "Phone number is necessary"]
      return
    }

    let regex = /^\+[1-9]{1}[0-9]{3,14}$/g
    if (!regex.test(countryCode + phone)) {
      errors = [...errors, "Enter a valid phone number"]
      return
    }

    handleLogin(phone, countryCode)
  }

  const handleTokenInput = () => {
    verifyToken(phone, countryCode, token)
  }

  const textFormat = (text) => {
    if (text.includes(',')) {
      return text.split(',')[0]
    } 

    if (text.includes(' ')) {
      return text.split(' ')[0] + " " + text.split(' ')[1]
    }

    return text
  }
</script>

{#if (authenticated)}
  <p>Successfully authenticated</p>
{:else}
  {#each errors as error}
    {error}
  {/each}
  {#each messages as message}
    {message}
  {/each}
  <div class="phone-container">
    <select bind:value={countryCode}>
      <option value="">Select country dial code</option>
      {#each CountryList.getList() as country}
        <option value="{country.dial_code}">{country.flag} {textFormat(country.name)} {country.dial_code}</option>
      {/each}
    </select>
    <input type="text" bind:value={phone} on:input={(e) => validateInput(e)}>
    <button on:click={handlePhoneInput}>Login</button>
  </div>
  {#if tokenSent}
    <div class="code-container">
      <input type="text" bind:value={token} on:input={(e) => validateInput(e)}>
      <button on:click={handleTokenInput}>Code</button>
    </div>
  {/if}
{/if}