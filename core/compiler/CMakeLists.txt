cmake_minimum_required(VERSION 3.16)
project(EmadocsCompiler)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Set compiler flags
if(MSVC)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} /W4")
    set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} /O2")
else()
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra -Wpedantic")
    set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} -O3")
    set(CMAKE_CXX_FLAGS_DEBUG "${CMAKE_CXX_FLAGS_DEBUG} -g -O0")
endif()

# Create executable
add_executable(emadocs-compiler emadocs-compiler.cpp)

# Set output directory
set_target_properties(emadocs-compiler PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin
)

# Install target
install(TARGETS emadocs-compiler
    RUNTIME DESTINATION bin
)

# Create symlink for easier access
if(UNIX)
    add_custom_target(create-symlink
        COMMAND ${CMAKE_COMMAND} -E create_symlink
        ${CMAKE_BINARY_DIR}/bin/emadocs-compiler
        ${CMAKE_SOURCE_DIR}/emadocs-compiler
        COMMENT "Creating symlink for emadocs-compiler"
    )
    add_dependencies(create-symlink emadocs-compiler)
endif()

# Print build information
message(STATUS "Building Emadocs Compiler")
message(STATUS "  C++ Standard: ${CMAKE_CXX_STANDARD}")
message(STATUS "  Build Type: ${CMAKE_BUILD_TYPE}")
message(STATUS "  Compiler: ${CMAKE_CXX_COMPILER_ID} ${CMAKE_CXX_COMPILER_VERSION}")
message(STATUS "  Output: ${CMAKE_BINARY_DIR}/bin/emadocs-compiler")
