<template>
  <div>
    <div class="title-block">
      <div class="flex-title"><h1 class="title-dashboard">Dashboard</h1></div>
      <div class="title-buttons">
        <a href="#" class="refresh-button">
          <img src="/img/icon/download-icon.svg" alt="">
          <span>Download all</span>
        </a>
        <a href="#" class="refresh-button">
          <img src="/img/icon/refresh-icon.svg" alt="">
          <span>Refresh</span>
        </a>
      </div>
    </div>
    <div class="main-dashboard">

      <div class="dropdown-blocks">

        <div class="flex-dropdown">
          <div class="pr-10">
          <Combobox as="div" v-model="selectedUser" nullable>
            <ComboboxLabel class="block text-sm font-medium text-gray-700">Users</ComboboxLabel>
            <div class="relative mt-1">
              <ComboboxInput class="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" @change="query = $event.target.value" :display-value="(user) => user?.email" />
              <ComboboxButton class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </ComboboxButton>

              <ComboboxOptions v-if="filteredUser.length > 0" class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <ComboboxOption v-for="user in filteredUser" :key="user.email" :value="user" as="template" v-slot="{ active, selected }">
                  <li :class="['relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-indigo-600 text-white' : 'text-gray-900']">
                  <span :class="['block truncate', selected && 'font-semibold']">
                    {{ user.email }}
                  </span>

                    <span v-if="selected" :class="['absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-indigo-600']">
              <CheckIcon class="h-5 w-5" aria-hidden="true" />
            </span>
                  </li>
                </ComboboxOption>
              </ComboboxOptions>
            </div>
          </Combobox>
          </div>

          <div class="pr-10">
          <Combobox as="div" v-model="selectedAccount" nullable>
            <ComboboxLabel class="block text-sm font-medium text-gray-700">Accounts</ComboboxLabel>
            <div class="relative mt-1">
              <ComboboxInput class="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" @change="query = $event.target.value" :display-value="(account) => account?.accountNumber" />
              <ComboboxButton class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </ComboboxButton>

              <ComboboxOptions v-if="filteredAccount.length > 0" class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <ComboboxOption v-for="account in filteredAccount" :key="account.accountNumber" :value="account" as="template" v-slot="{ active, selected }">
                  <li :class="['relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-indigo-600 text-white' : 'text-gray-900']">
            <span :class="['block truncate', selected && 'font-semibold']">
              {{ account.accountNumber }}
            </span>

                    <span v-if="selected" :class="['absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-indigo-600']">
              <CheckIcon class="h-5 w-5" aria-hidden="true" />
            </span>
                  </li>
                </ComboboxOption>
              </ComboboxOptions>
            </div>
          </Combobox>
          </div>

          <button @click="queryResources" type="button" class="mt-5 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Apply</button>
        </div>
        <div class='sort-dropdown-block'>
          <select class="sort-dropdown" >
            <option class="dropdown-all-acc">Sort: A - Z</option>
            <option class="dropdown-all-acc">Sort: Z - A</option>
          </select>
        </div>
      </div>

      <BulletListLoader v-if="loading"></BulletListLoader>
      <div v-else class="main-info">

        <div class="flex items-center justify-center space-x-2">
          <div class="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
          <div class="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
          <div class="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
        </div>

        <div v-if="!loading && resources.length > 0" class="info-block" v-for="item in filteredResources">
            <div class="content-info-block">
              <div class="info-email">{{ item.created_by }}</div>
              <div class="info-services">

                <div @click.prevent="openModal(resource)" class="service-block modal-toggle tooltip bottom" :tooltip-text="resource.type.replaceAll('::', ' ')" v-for="resource in item.resources.slice(0, 3)">
                  <img :src="'/AWS_Icon_Svg/' + resource.image_url" alt="" class="service-img">
                  <span>{{ resource.count }}</span>
                </div>

              </div>
              <a href="#" class="add-more" v-if="item.resources.length > 3">and {{ item.resources.length - 3 }} more...</a>
            </div>

          <div class="button-info-block">
            <a href="#" class="download-info">
              <img src="/img/icon/download-info.svg" alt="">
            </a>

            <a href="#" class="open-info">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.6485 0.751479C11.1799 0.282849 10.4201 0.282849 9.95147 0.751478L6 4.70295L2.04853 0.751477C1.5799 0.282848 0.820101 0.282848 0.351473 0.751477C-0.117157 1.22011 -0.117157 1.9799 0.351472 2.44853L5.15147 7.24853C5.6201 7.71716 6.3799 7.71716 6.84853 7.24853L11.6485 2.44853C12.1172 1.97991 12.1172 1.22011 11.6485 0.751479Z"/>
              </svg>
            </a>
          </div>

        </div>


        <div v-if="accounts.length === 0 && !loading" class="no-tags-block" style="width: 100%; margin: 0 auto;" >
          <svg width="299" height="190" viewBox="0 0 299 190" fill="none"
                                               xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_845_4495)">
            <path
                d="M-9.35938 145.387L27.9927 145.268L65.3449 145.225L140.049 145.142L214.753 145.224L252.105 145.267L289.458 145.387L252.105 145.508L214.753 145.551L140.049 145.632L65.3449 145.55L27.9927 145.507L-9.35938 145.387Z"
                fill="#828282"></path>
            <path
                d="M141.031 182C218.853 182 281.941 175.09 281.941 166.566C281.941 158.042 218.853 151.132 141.031 151.132C63.2086 151.132 0.121094 158.042 0.121094 166.566C0.121094 175.09 63.2086 182 141.031 182Z"
                fill="#EBEBEB"></path>
            <path d="M210.385 169.885H60.6602L82.31 47.1528H232.034L210.385 169.885Z" fill="white"></path>
            <path d="M133.554 34.4424H84.5524L82.3105 47.1527H134.75L133.554 34.4424Z"
                  fill="white"></path>
            <g opacity="0.1">
              <mask id="path-5-inside-1_845_4495" fill="white">
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M84.5524 34.4424H133.554L134.75 47.1527L232.034 47.1527L210.385 169.885H60.6602L82.31 47.1527L82.3106 47.1527L84.5524 34.4424Z"></path>
              </mask>
              <path
                  d="M133.554 34.4424L136.54 34.1612L136.284 31.4424H133.554V34.4424ZM84.5524 34.4424V31.4424H82.0352L81.598 33.9213L84.5524 34.4424ZM134.75 47.1527L131.763 47.4339L132.019 50.1527H134.75V47.1527ZM232.034 47.1527L234.988 47.6739L235.61 44.1527H232.034V47.1527ZM210.385 169.885V172.885H212.902L213.339 170.406L210.385 169.885ZM60.6602 169.885L57.7058 169.364L57.0846 172.885H60.6602V169.885ZM82.31 47.1527L82.3153 44.1527L79.7937 44.1483L79.3556 46.6316L82.31 47.1527ZM82.3106 47.1527L82.3052 50.1527L84.8269 50.1572L85.265 47.6738L82.3106 47.1527ZM133.554 31.4424H84.5524V37.4424H133.554V31.4424ZM137.737 46.8716L136.54 34.1612L130.567 34.7236L131.763 47.4339L137.737 46.8716ZM134.75 50.1527L232.034 50.1527V44.1527L134.75 44.1527V50.1527ZM229.08 46.6316L207.43 169.364L213.339 170.406L234.988 47.6739L229.08 46.6316ZM210.385 166.885H60.6602V172.885H210.385V166.885ZM63.6145 170.406L85.2644 47.6739L79.3556 46.6316L57.7058 169.364L63.6145 170.406ZM82.3047 50.1527L82.3052 50.1527L82.3159 44.1528L82.3153 44.1527L82.3047 50.1527ZM81.598 33.9213L79.3562 46.6316L85.265 47.6738L87.5068 34.9635L81.598 33.9213Z"
                  fill="#4876EB" mask="url(#path-5-inside-1_845_4495)"></path>
            </g>
            <path d="M187.191 53.6082L207.774 167.885H61.7918L41.2088 53.6082H187.191Z" fill="white"
                  stroke="#EDF2FD" stroke-width="4"></path>
            <path
                d="M90.8108 123.912C94.2552 123.912 97.0474 121.121 97.0474 117.678C97.0474 114.235 94.2552 111.444 90.8108 111.444C87.3664 111.444 84.5742 114.235 84.5742 117.678C84.5742 121.121 87.3664 123.912 90.8108 123.912Z"
                fill="#4F4F4F"></path>
            <path
                d="M140.112 123.912C143.556 123.912 146.348 121.121 146.348 117.678C146.348 114.235 143.556 111.444 140.112 111.444C136.667 111.444 133.875 114.235 133.875 117.678C133.875 121.121 136.667 123.912 140.112 123.912Z"
                fill="#4F4F4F"></path>
            <path
                d="M124.421 124.907L124.079 124.255C124.047 124.196 120.826 118.243 114.343 118.243C108.431 118.243 106.99 123.848 106.931 124.086L106.756 124.8L105.326 124.455L105.498 123.74C105.515 123.67 107.255 116.769 114.343 116.769C121.733 116.769 125.239 123.293 125.384 123.571L125.727 124.223L124.421 124.907Z"
                fill="#4F4F4F"></path>
            <path
                d="M197.519 102.797C205.423 103.116 213.329 99.9392 216.23 93.8658C222.626 80.473 208.102 66.3412 215.875 51.0076C223.29 36.3807 240.199 41.4451 246.026 46.0219C252.462 51.077 247.413 56.9577 241.126 53.6117C230.227 47.8107 227.537 33.0243 238.11 21.3316C246.01 12.596 257.599 12.512 262.161 12.8694"
                stroke="#4F4F4F" stroke-miterlimit="10" stroke-dasharray="4 4"></path>
            <rect x="222.869" y="2.31069" width="55.8456" height="17.6103" rx="8.80515"
                  transform="rotate(15 222.869 2.31069)" fill="white"></rect>
            <path
                d="M233.458 17.42C233.04 17.308 232.746 17.1088 232.576 16.8224C232.406 16.536 232.377 16.1837 232.489 15.7655L233.51 11.9547L234.263 12.1564L233.25 15.9358C233.19 16.1606 233.199 16.3478 233.276 16.4974C233.359 16.6485 233.505 16.752 233.714 16.808C233.95 16.8711 234.163 16.8582 234.355 16.7696L234.445 17.3736C234.304 17.4422 234.145 17.4782 233.971 17.4818C233.801 17.4869 233.63 17.4663 233.458 17.42ZM232.395 13.2946L232.561 12.6752L235.211 13.3853L235.045 14.0048L232.395 13.2946ZM237.87 18.5518L238.105 17.6736L238.11 17.4984L238.511 16.0008C238.597 15.6819 238.568 15.411 238.426 15.1881C238.291 14.9613 238.038 14.7982 237.667 14.6988C237.421 14.633 237.169 14.6104 236.912 14.631C236.656 14.6463 236.428 14.7003 236.23 14.7928L236.067 14.1442C236.328 14.0291 236.619 13.967 236.941 13.958C237.269 13.9452 237.598 13.9829 237.927 14.0711C238.497 14.2238 238.899 14.48 239.133 14.8396C239.368 15.1993 239.408 15.6641 239.256 16.2339L238.583 18.743L237.87 18.5518ZM236.493 18.2333C236.184 18.1506 235.927 18.0255 235.719 17.8579C235.517 17.6918 235.378 17.5004 235.302 17.2838C235.227 17.062 235.221 16.8335 235.284 16.5983C235.344 16.3735 235.451 16.1836 235.604 16.0287C235.763 15.8751 235.978 15.7757 236.247 15.7304C236.523 15.6864 236.867 15.7198 237.28 15.8304L238.597 16.1834L238.452 16.7244L237.166 16.3799C236.79 16.279 236.519 16.2738 236.355 16.3642C236.191 16.4547 236.085 16.5888 236.037 16.7665C235.982 16.9704 236.019 17.1567 236.148 17.3256C236.278 17.4893 236.486 17.6096 236.774 17.6866C237.056 17.7623 237.319 17.7654 237.561 17.696C237.809 17.6279 238.012 17.4863 238.171 17.271L238.181 17.8285C238.016 18.0475 237.788 18.1966 237.498 18.2758C237.21 18.3497 236.874 18.3355 236.493 18.2333ZM241.375 21.1719C240.994 21.0696 240.637 20.9153 240.306 20.7089C239.978 20.5091 239.729 20.2798 239.557 20.0209L240.074 19.5373C240.222 19.7564 240.425 19.9508 240.682 20.1205C240.938 20.2955 241.22 20.4243 241.528 20.5069C242.02 20.6386 242.411 20.6202 242.703 20.4519C242.994 20.2835 243.203 19.9641 243.329 19.4936L243.565 18.6154L243.864 17.8131L244.047 16.9715L244.352 15.8345L245.065 16.0257L244.103 19.6169C243.907 20.3487 243.58 20.8381 243.121 21.0851C242.663 21.332 242.081 21.361 241.375 21.1719ZM241.748 19.406C241.345 19.2981 241.007 19.1178 240.733 18.8651C240.465 18.6086 240.278 18.3035 240.171 17.9499C240.069 17.5977 240.072 17.2229 240.178 16.8256C240.286 16.4231 240.471 16.0974 240.734 15.8485C241.004 15.5957 241.318 15.4277 241.676 15.3445C242.04 15.2626 242.423 15.2757 242.825 15.3835C243.181 15.4787 243.485 15.6388 243.739 15.8636C243.994 16.0832 244.168 16.365 244.26 16.7092C244.358 17.0548 244.346 17.455 244.224 17.9098C244.104 18.3593 243.915 18.7093 243.657 18.9596C243.405 19.2113 243.112 19.3738 242.779 19.4469C242.447 19.5149 242.103 19.5012 241.748 19.406ZM242.01 18.7704C242.287 18.8447 242.548 18.853 242.794 18.7954C243.039 18.7378 243.249 18.6232 243.424 18.4516C243.604 18.2813 243.729 18.0629 243.801 17.7963C243.872 17.5297 243.873 17.2777 243.802 17.0402C243.736 16.8041 243.611 16.6025 243.426 16.4353C243.242 16.2628 243.012 16.1395 242.735 16.0653C242.458 15.991 242.194 15.982 241.944 16.0382C241.7 16.0905 241.488 16.2018 241.308 16.3721C241.133 16.5437 241.01 16.7628 240.939 17.0294C240.867 17.296 240.865 17.5474 240.93 17.7835C241.001 18.0209 241.128 18.2259 241.312 18.3983C241.5 18.5722 241.733 18.6962 242.01 18.7704ZM244.546 20.8618L244.676 20.3756L248.597 21.4261L248.467 21.9123L244.546 20.8618ZM251.501 22.2548C251.146 22.1595 250.845 21.995 250.6 21.7611C250.361 21.5234 250.2 21.2254 250.117 20.8669C250.039 20.5098 250.063 20.0961 250.189 19.6256C250.315 19.1551 250.504 18.7855 250.755 18.5167C251.011 18.2493 251.302 18.075 251.626 17.9938C251.956 17.914 252.293 17.9203 252.638 18.0128C253.046 18.122 253.382 18.3075 253.649 18.5693C253.915 18.8311 254.096 19.1459 254.194 19.5138C254.293 19.8765 254.285 20.2695 254.172 20.6929C254.059 21.1163 253.868 21.463 253.599 21.7328C253.331 22.0026 253.016 22.1844 252.655 22.2781C252.293 22.3718 251.909 22.364 251.501 22.2548ZM249.311 21.6173L250.869 15.7993L251.622 16.001L250.881 18.7689L250.544 19.7123L250.332 20.6894L250.032 21.8106L249.311 21.6173ZM251.615 21.5793C251.882 21.6507 252.136 21.6544 252.377 21.5902C252.623 21.5274 252.836 21.4023 253.015 21.215C253.201 21.0238 253.333 20.7818 253.411 20.4891C253.491 20.1912 253.497 19.9182 253.429 19.6703C253.368 19.4185 253.246 19.2038 253.064 19.0261C252.887 18.8499 252.665 18.726 252.399 18.6546C252.137 18.5846 251.883 18.5809 251.637 18.6438C251.396 18.708 251.183 18.833 250.998 19.019C250.821 19.2011 250.692 19.4411 250.612 19.7391C250.534 20.0318 250.525 20.3066 250.585 20.5636C250.651 20.8168 250.773 21.0315 250.95 21.2078C251.132 21.3854 251.354 21.5093 251.615 21.5793ZM256.423 23.5734C256.004 23.4614 255.658 23.2705 255.383 23.0007C255.108 22.7309 254.919 22.4113 254.816 22.042C254.715 21.6675 254.719 21.2764 254.828 20.8686C254.939 20.4557 255.131 20.115 255.404 19.8465C255.678 19.5781 256.001 19.3984 256.372 19.3075C256.745 19.2114 257.141 19.2194 257.559 19.3314C257.972 19.4421 258.316 19.6323 258.591 19.9021C258.873 20.1681 259.063 20.485 259.16 20.8529C259.264 21.217 259.26 21.6081 259.148 22.0263C259.038 22.4393 258.845 22.78 258.572 23.0484C258.303 23.3182 257.98 23.5005 257.602 23.5952C257.229 23.6914 256.836 23.6841 256.423 23.5734ZM256.599 22.9148C256.866 22.9862 257.12 22.9898 257.361 22.9256C257.607 22.8628 257.82 22.7378 257.999 22.5504C258.18 22.3579 258.309 22.1152 258.388 21.8225C258.468 21.5245 258.476 21.2523 258.413 21.0057C258.352 20.754 258.23 20.5393 258.048 20.3616C257.871 20.1854 257.649 20.0615 257.383 19.9901C257.116 19.9186 256.862 19.915 256.621 19.9792C256.38 20.0434 256.167 20.1685 255.983 20.3544C255.8 20.5351 255.668 20.7745 255.588 21.0724C255.51 21.3652 255.503 21.6407 255.569 21.8991C255.635 22.1523 255.757 22.367 255.934 22.5433C256.111 22.7195 256.332 22.8434 256.599 22.9148ZM261.047 24.8125C260.629 24.7005 260.335 24.5013 260.165 24.2148C259.995 23.9284 259.966 23.5761 260.078 23.158L261.1 19.3472L261.852 19.5489L260.84 23.3283C260.779 23.5531 260.788 23.7403 260.866 23.8899C260.948 24.041 261.094 24.1445 261.303 24.2005C261.539 24.2636 261.752 24.2507 261.944 24.1621L262.034 24.7661C261.893 24.8346 261.735 24.8707 261.56 24.8743C261.39 24.8794 261.219 24.8588 261.047 24.8125ZM259.984 20.6871L260.15 20.0677L262.8 20.7778L262.634 21.3973L259.984 20.6871Z"
                fill="#4F4F4F"></path>
            <rect x="222.869" y="2.31069" width="55.8456" height="17.6103" rx="8.80515"
                  transform="rotate(15 222.869 2.31069)" stroke="#4876EB" stroke-width="0.507353"></rect>
          </g>
          <defs>
            <clipPath id="clip0_845_4495">
              <rect width="298.29" height="190" fill="white" transform="translate(0.355469)"></rect>
            </clipPath>
          </defs>
        </svg>
          <h2>You don't have any accounts onboarded yet</h2><span>Onboard your first account to get started..</span>
          <a href="#" @click.prevent="$goTo('get-started')" class="add-tag-button modal-toggle">Onboard Account</a>
        </div>

      </div>


      <div class="pagination-block" >
        <a href="#" class="prev-button">
          <img src="/img/icon/prev-button.svg" alt="">
          <span class="pagination-button">Previous</span>
        </a>
        <a href="#" class="pagination-number">1 2 3 4 5 6</a>
        <a href="#" class="next-button">
          <span class="pagination-button">Next</span>
          <img src="/img/icon/next-button.svg" alt="">
        </a>
      </div>

    </div>

    <ResourcesModal></ResourcesModal>
  </div>
</template>

<script>
import {userStore} from "../store/userStore"
import _ from 'lodash'

import ResourcesModal from "../components/dashboard/ResourcesModal.vue";

export default {
  data() {
    return {
      userQuery: "",
      accountQuery: "",
      selectedUser: null,
      selectedAccount: null,
      selectedResourceType: null,
      accounts: [],
      resources: [],
      filteredResources: [],
      polling: null,
      loading: true,
      open: false,
    }
  },
  computed: {
    users() {
      return _.map(this.resources, function square(n) {
        return { email: n.created_by }
      })
    },
    filteredUser () {
      return this.userQuery === ""
          ? this.users
          : this.users.filter((user) => {
            return user.email.includes(this.userQuery.email)
          })
    },
    filteredAccount () {
      return this.accountQuery === ""
          ? this.accounts
          : this.accounts.filter((account) => {
            return account.id.includes(this.accountQuery.accountNumber)
          })
    },
  },
  methods: {
    openModal(resource) {
      console.log("Opening...")
      this.$mitt.emit('open-resource-modal', { user: resource.created_by, tenant: resource.tenant_id, type: resource.type})
    },
    queryResources() {
      console.log('filetering results...')
      this.filteredResources =  this.selectedUser === null ? this.resources : this.resources.filter((resource) => {
        return resource.created_by === this.selectedUser.email
      })
    },
    stopPolling() {
      clearInterval(this.polling)
    },
    pollProfileReady () {
      const userData = userStore()
      var self = this
      this.polling = setInterval(() => {
        if(userData.profile_loaded===true && userData.accounts_loaded){
          self.stopPolling()
          console.log("Profile ready.")
          self.user = userData.getData()
          self.accounts = userData.getAccounts()
          self.loadResources()
        }
      }, 3000)
    },
    loadResources() {
      var self = this
      this.$api.post('tenants/' + this.user.tenantId + '/analytics/resourcesPerUser').then((response) => {
        // console.log(response)
        self.resources = response.data
        self.filteredResources = response.data
        self.loading = false
      }).catch((error) => {
        this.$toast.error(error.message)
      })
    }
  },
  created() {
    this.pollProfileReady()
  },
  components: {
    ResourcesModal,
  }
}
</script>

<style lang="css">
.data-headlessui-state {
  padding-right: 20px;
}
</style>

