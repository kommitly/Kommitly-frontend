# NOTES

md for tailwind is sm for mui, apply this to all screen sizes

Tailwind
2xl-(67%-80%)
xl- my screen
lg- zan
md-150%

MUI
lg-my screen
md-zans
xl-stanleys

{showGoalBreakdown && goalData && taskData && !isScrolledDown && (
<>

<div className='flex  w-full  items-center justify-center flex-wrap gap-4'>

      <Box

className="w-6/12 sm:w-full bg-[#F4F1FF] p-2 z-10 rounded-full fixed bottom-4"
sx={{
    backgroundColor: colors.background.paper,
    boxShadow: `
      inset 0px 4px 12px rgba(43, 24, 89, 0.25),
      -8px 0px 12px rgba(43, 24, 89, 0.10),
      0px 8px 12px rgba(43, 24, 89, 0.50)
    `
  }}

>

          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center w-full gap-4 ml-2'>
              <IconButton>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1D1B20"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#65558F]"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </IconButton>

              <input
                type="text"
                placeholder='Add a new goal'
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === 'Enter' && handleFormSubmit()}
                className='text-[#49454F] outline-none border-none w-full text-xs'
              />

            </div>
            <IconButton onClick={handleFormSubmit}>
              <LuSendHorizontal size={16} className='text-[#1D1B20] ' />
            </IconButton>
          </div>
        </Box>
      </div>
      <div className='flex w-full flex-wrap gap-4'>
      <div className='w-11/12  flex justify-end' >
      <IconButton onClick={handleScrollToBottom} sx={{ backgroundColor: colors.background.paper, borderRadius: '50%', padding: '8px' }}>

                 {/* Down Arrow Icon */}
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#65558F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                   <path d="M19 9l-7 7-7-7" />
                 </svg>
               </IconButton>
      </div>

      </div>
      </>
      )}
