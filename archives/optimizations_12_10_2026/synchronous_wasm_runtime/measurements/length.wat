 (func $75 (param $0 i32) (result i32)
  (i32.load offset=96
   (i32.load
    (i32.add
     (i32.load
      (i32.const 2980)
     )
     (i32.shl
      (local.get $0)
      (i32.const 2)
     )
    )
   )
  )
 )
